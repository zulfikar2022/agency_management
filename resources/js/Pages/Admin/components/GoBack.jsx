import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

function GoBack({ targetRouteName, text }) {
  return (
    <div>
      <Link
        href={route(targetRouteName)}
        className="flex items-center text-sm text-blue-600 hover:underline mb-4 ml-5"
      >
        <span>
          <ArrowLeft size={16} strokeWidth={1} />
        </span>
        <span className="ml-1">{text || 'ফিরে যান'}</span>
      </Link>
    </div>
  );
}

export default GoBack;
