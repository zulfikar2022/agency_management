import { Link } from '@inertiajs/react';

function Error() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-red-600 text-center text-2xl font-bold">
          আপনার অনুরোধকৃত পৃষ্ঠা পাওয়া যায়নি।
        </h1>
        <Link className="text-blue-600 underline my-4" href={route('home')}>
          প্রথম পৃষ্ঠায় ফিরে যান
        </Link>
      </div>
    </div>
  );
}

export default Error;
