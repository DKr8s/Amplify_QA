import { useEffect } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { Question } from "./models";

export default function CleanupInvalidQuestions() {
  useEffect(() => {
    async function cleanInvalidQuestions() {
      const allQuestions = await DataStore.query(Question);
      const invalidQuestions = allQuestions.filter((q) =>
        q.imageUrl && q.imageUrl.includes("?X-Amz-")
      );

      if (invalidQuestions.length === 0) {
        console.log("✅ Không có bản ghi lỗi cần xoá.");
        return;
      }

      for (const q of invalidQuestions) {
        await DataStore.delete(q);
        console.log("🧹 Đã xoá:", q.Text || q.id);
      }

      console.log(`✅ Đã xoá ${invalidQuestions.length} bản ghi lỗi.`);
    }

    cleanInvalidQuestions();
  }, []);

  return <div style={{ padding: '2rem', textAlign: 'center' }}>🧼 Cleaning invalid questions... Check console.</div>;
}
