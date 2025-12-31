import Link from "next/link"

export default function NotFoundPage(){
    return <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400">
          The page you are looking for does not exist.
          <br />
            <Link href="/" className="text-[#927194] hover:underline">Go back home</Link>
        </p>
      </div>
    </div>
}