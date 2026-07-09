import Layout from "@/components/common/Layout";
import { CardContent, CardTitle } from "@/components/ui/card";

export default function Page1() {
  return (
    <Layout>
      <CardContent className="p-8">
        <CardTitle className="text-2xl font-bold mb-4">
          페이지1입니다.
        </CardTitle>
      </CardContent>
    </Layout>
  );
}
