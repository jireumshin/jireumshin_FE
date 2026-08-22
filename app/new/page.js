"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Scale, ArrowLeft } from "lucide-react";
import Layout from "@/components/common/Layout";
import BrutalButton from "@/components/common/BrutalButton";
import BrutalIconButton from "@/components/common/BrutalIconButton";
import ServerGuard from "@/components/common/ServerGuard";
import CandidateFields from "@/components/widgets/trials/CandidateFields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { selectors } from "@/stores";
import { createTrial, uploadTrialImage } from "@/stores/trialsSlice";
import { compressImage } from "@/lib/image";
import { fieldCls } from "@/lib/formStyles";

const JURORS = [
  { emoji: "🐿️", name: "가성비요정" },
  { emoji: "🧘", name: "텅장지킴이" },
  { emoji: "🔥", name: "지름요정" },
  { emoji: "🔮", name: "팩트봇" },
];

const digitsOf = (s) => s.replace(/[^0-9]/g, "");
const formatPrice = (raw) => {
  const d = digitsOf(raw);
  return d ? Number(d).toLocaleString("ko-KR") : "";
};

function NewTrialForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const creating = useSelector(selectors.getTrialCreating);

  // 후보 A (단일 모드 = A만 사용)
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [reason, setReason] = useState("");
  const [image, setImage] = useState(null);

  // 비교 모드 + 후보 B (홈의 'A vs B' 카드로 진입 시 ?mode=versus)
  const [versus, setVersus] = useState(
    useSearchParams().get("mode") === "versus",
  );
  const [nameB, setNameB] = useState("");
  const [priceB, setPriceB] = useState("");
  const [reasonB, setReasonB] = useState("");
  const [imageB, setImageB] = useState(null);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!image?.url) return;
    return () => URL.revokeObjectURL(image.url);
  }, [image]);
  useEffect(() => {
    if (!imageB?.url) return;
    return () => URL.revokeObjectURL(imageB.url);
  }, [imageB]);

  // 사려는 이유는 필수 — 이유를 듣고 판결하므로
  const aOk =
    name.trim() !== "" && digitsOf(price) !== "" && reason.trim() !== "";
  const bOk =
    nameB.trim() !== "" && digitsOf(priceB) !== "" && reasonB.trim() !== "";
  const canSubmit = versus ? aOk && bOk : aOk;

  const onPrice = (e) => setPrice(formatPrice(e.target.value));
  const onPriceB = (e) => setPriceB(formatPrice(e.target.value));

  const pickImage = (setter) => (file) =>
    setter({ file, url: URL.createObjectURL(file) });

  const onImage = (e) => {
    const file = e.target.files?.[0];
    if (file) setImage({ file, url: URL.createObjectURL(file) });
  };
  const removeImage = () => setImage(null);

  const uploadIfAny = async (img) =>
    img?.file
      ? dispatch(uploadTrialImage(await compressImage(img.file))).unwrap()
      : undefined;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || creating || uploading) return;
    try {
      let imageUrl;
      let imageUrlB;
      if (image?.file || (versus && imageB?.file)) {
        setUploading(true);
        try {
          imageUrl = await uploadIfAny(image);
          if (versus) imageUrlB = await uploadIfAny(imageB);
        } catch {
          toast.error(
            "사진 업로드에 실패했어요. 다른 사진을 고르거나 사진을 빼고 다시 시도해주세요.",
          );
          return;
        } finally {
          setUploading(false);
        }
      }

      const payload = {
        itemName: name.trim(),
        price: Number(digitsOf(price)),
        reason: reason.trim() || undefined,
        imageUrl,
      };
      if (versus) {
        payload.mode = "VERSUS";
        payload.itemNameB = nameB.trim();
        payload.priceB = Number(digitsOf(priceB));
        payload.reasonB = reasonB.trim() || undefined;
        payload.imageUrlB = imageUrlB;
      }

      const created = await dispatch(createTrial(payload)).unwrap();
      toast(
        versus
          ? "⚖ 비교 재판 접수! 배심원단을 소집합니다"
          : "🔨 기소 접수! 배심원단을 소집합니다",
      );
      router.push(`/trial/?id=${created.id}`);
    } catch (err) {
      toast.error(
        err?.message || "기소 접수에 실패했어요. 잠시 후 다시 시도해주세요.",
      );
    }
  };

  const backBtn = (
    <BrutalIconButton aria-label="뒤로" onClick={() => router.push("/")}>
      <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
    </BrutalIconButton>
  );

  return (
    <Layout
      isLoading={creating || uploading}
      headerProps={{ subtitle: "새 사건 접수", right: backBtn }}
    >
      <ServerGuard />
      <form
        id="jiso-form"
        onSubmit={onSubmit}
        className="space-y-6 px-5 pb-8 pt-6"
      >
        <header className="text-center">
          <p className="inline-block -rotate-2 rounded-full border border-jj-line bg-jj-violet px-3 py-1 font-round text-xs text-white shadow-hard-sm">
            ⚖ 배심원 4명 대기중
          </p>
          <h1 className="mt-3.5 font-display text-[26px] leading-tight">
            {versus ? (
              <>
                둘 중 뭘 살까,{" "}
                <span className="relative inline-block text-jj-violet">
                  <span className="absolute inset-x-0 bottom-1 z-0 h-2.5 -rotate-1 bg-jj-yellow" />
                  <span className="relative z-10">저울에 올리세요</span>
                </span>
              </>
            ) : (
              <>
                살까 말까 고민되는
                <br />그 물건,{" "}
                <span className="relative inline-block text-jj-red">
                  <span className="absolute inset-x-0 bottom-1 z-0 h-2.5 -rotate-1 bg-jj-yellow" />
                  <span className="relative z-10">기소하세요</span>
                </span>
              </>
            )}
          </h1>
          <p className="mt-2.5 text-sm font-semibold text-jj-muted">
            {versus
              ? "배심원들이 A·B를 저울에 올려 비교해드려요"
              : "배심원들이 갑론을박 끝에 판결을 내려드려요"}
          </p>
        </header>

        <ul className="flex justify-center gap-2.5">
          {JURORS.map((j) => (
            <li key={j.name} className="flex flex-col items-center gap-1.5">
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-jj-line bg-jj-paper text-2xl shadow-hard-sm">
                {j.emoji}
              </span>
              <small className="font-round text-[9px] text-jj-muted">
                {j.name}
              </small>
            </li>
          ))}
        </ul>

        {versus ? (
          <div className="space-y-4">
            <CandidateFields
              title="🅰 후보 A"
              image={image}
              onPickImage={pickImage(setImage)}
              onRemoveImage={removeImage}
              name={name}
              onName={setName}
              price={price}
              onPrice={onPrice}
              reason={reason}
              onReason={setReason}
              namePlaceholder="예: 에어팟 프로 3"
              pricePlaceholder="359,000"
              reasonPlaceholder="예: 노이즈캔슬링이 확실해서 지하철에서 좋을 것 같아요"
            />
            <div className="text-center font-display text-lg text-jj-violet">
              VS
            </div>
            <CandidateFields
              title="🅱 후보 B"
              image={imageB}
              onPickImage={pickImage(setImageB)}
              onRemoveImage={() => setImageB(null)}
              name={nameB}
              onName={setNameB}
              price={priceB}
              onPrice={onPriceB}
              reason={reasonB}
              onReason={setReasonB}
              namePlaceholder="예: 에어팟 4세대"
              pricePlaceholder="199,000"
              reasonPlaceholder="예: 16만원 싸고 노캔은 아쉽지만 무난할 것 같아요"
              onRemove={() => setVersus(false)}
            />
          </div>
        ) : (
          <>
            <fieldset className="min-w-0 space-y-4 rounded-2xl border border-jj-line bg-jj-paper p-4 shadow-hard">
              {image ? (
                <figure className="relative m-0 mb-4 aspect-3/2 w-full overflow-hidden rounded-xl border border-jj-line shadow-hard-sm">
                  <img
                    src={image.url}
                    alt="상품 사진"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    aria-label="사진 삭제"
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full border border-jj-line bg-jj-red font-display text-sm text-white shadow-hard-sm"
                  >
                    ✕
                  </button>
                </figure>
              ) : (
                <label className="flex h-20 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-jj-line bg-jj-app font-display text-sm text-jj-muted">
                  📷 상품 사진 추가
                  <span className="font-round text-xs font-normal">(선택)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImage}
                    className="hidden"
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-display text-sm">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-jj-ink text-[11px] text-jj-yellow">
                    1
                  </span>
                  무엇을 사려고 하나요?
                </span>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={40}
                  placeholder="예: 노이즈캔슬링 무선 헤드폰"
                  className={fieldCls}
                />
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-display text-sm">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-jj-ink text-[11px] text-jj-yellow">
                    2
                  </span>
                  얼마인가요?
                </span>
                <span className="relative block">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-display text-jj-violet">
                    ₩
                  </span>
                  <Input
                    value={price}
                    onChange={onPrice}
                    inputMode="numeric"
                    placeholder="349,000"
                    className={`${fieldCls} pl-8`}
                  />
                </span>
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 font-display text-sm">
                  <span className="grid h-5 w-5 place-items-center rounded-md bg-jj-ink text-[11px] text-jj-yellow">
                    3
                  </span>
                  사려는 이유는?
                  <span className="font-round text-[10px] font-normal text-jj-muted">
                    — 솔직할수록 재밌어져요
                  </span>
                </span>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="예: 지금 쓰는 건 멀쩡한데 신형 색깔이 너무 예뻐서요…"
                  className={`${fieldCls} resize-none`}
                />
                <span className="mt-1 block text-right font-round text-[10px] text-jj-muted">
                  {reason.length}/500
                </span>
              </label>
            </fieldset>

            <button
              type="button"
              onClick={() => setVersus(true)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-[2.5px] border-dashed border-jj-violet bg-jj-violet-soft py-3 font-display text-sm text-jj-violet"
            >
              <Scale className="h-4 w-4" strokeWidth={2.5} />둘 중 고민? 비교
              재판으로 바꾸기
            </button>
          </>
        )}

        <div className="pt-1">
          <BrutalButton
            tone="red"
            type="submit"
            disabled={!canSubmit || creating || uploading}
            className="w-full text-[17px]"
          >
            {uploading
              ? "📷 사진 올리는 중…"
              : versus
                ? "⚖ 비교 재판 시작"
                : "🔨 기소하고 재판 시작"}
          </BrutalButton>
          <p className="mt-2.5 text-center font-round text-[11px] text-jj-muted">
            약 30초 · 로그인 없이 바로 시작
          </p>
        </div>
      </form>
    </Layout>
  );
}

export default function NewTrialPage() {
  return (
    <Suspense
      fallback={<Layout isLoading headerProps={{ subtitle: "새 사건 접수" }} />}
    >
      <NewTrialForm />
    </Suspense>
  );
}
