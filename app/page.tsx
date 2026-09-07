import { Card } from "@/components/ui/card";
import { Button } from "@base-ui/react";
import Link from "next/link";


export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className=" p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Welcome to the Home Page</h1>
        <p className="mt-4 text-gray-600">
          This is a sample home page using the Base UI React components.
        </p>
        <Link href="/documents/1">
          <Button className="mt-6 bg-black text-white hover:bg-gray-800">
            Click Me
          </Button>
        </Link>
      </Card>
    </div>
  );
}
