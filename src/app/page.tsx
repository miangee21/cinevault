//src/app/page.tsx

import { Button } from "@/shared/components/ui/button";

export default function Home() {
  return (
    <>
    <div className="bg-white dark:bg-black text-blue-950 dark:text-zinc-50">
      hello this is main page
      <Button>Click me</Button>
    </div>
    </>
  );
}
