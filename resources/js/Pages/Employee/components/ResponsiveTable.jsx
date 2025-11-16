import { colClasses } from '@/constants';
import { Link, router } from '@inertiajs/react';

function ResponsiveTable({ data, actionData = null }) {
  if (data?.length === 0) {
    return <div className="text-center my-10 text-gray-500">কোন তথ্য নেই</div>;
  }

  return (
    <div className="container md:mx-auto sm:mx-10 mt-10">
      {data?.map((item, index) => {
        let pairs = Object.entries(item);

        return (
          <div
            onClick={() => {
              //  router.get(route("profile.edit"));
            }}
            key={index}
            className={`grid grid-cols-1 ${colClasses[pairs.length + (actionData ? 1 : 0)]} gap-2 mb-4 border-b pb-2 px-5 md:px-0`}
          >
            {pairs.map(([key, value], indx) => {
              return (
                <div key={indx} className="flex flex-col">
                  <p className="font-bold">{key}:</p>
                  <p>{value}</p>
                </div>
              );
            })}
            {actionData && (
              <div>
                {actionData?.map((action, actIndx) => (
                  <Link
                    className="btn btn-sm btn-outline"
                    key={action?.label}
                    href={route(action?.routeName, {
                      [action?.paramName]: item?.আইডি,
                    })}
                  >
                    {action?.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ResponsiveTable;
