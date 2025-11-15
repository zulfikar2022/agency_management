import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

function GoBack({ previousUrl = '/' }) {
  return (
    <div>
      {/* <Link
        href={previousUrl}
        className="flex items-center text-sm text-blue-600 hover:underline mb-4"
      >
        <ArrowLeft size={16} strokeWidth={1} />
        <span className="ml-1">ফিরে যান</span>
      </Link> */}
    </div>
  );
}

export default GoBack;
