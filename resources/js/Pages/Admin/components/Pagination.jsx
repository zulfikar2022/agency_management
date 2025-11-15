function Pagination({ paginationData, queryParams = {} }) {
  let links = paginationData?.links || [];
  // remove the first and the last entry of the links array and put them into the links itself
  links = links?.slice(1, -1);
  let prevNext = [
    paginationData?.links[0],
    paginationData?.links[paginationData?.links.length - 1],
  ];
  let plainPrams = '';
  Object.keys(queryParams).forEach((key) => {
    plainPrams += `&${key}=${queryParams[key]}`;
  });

  console.log(links);
  // append the query params to the links
  links = links.map((link) => {
    if (!link?.url?.includes('?')) {
      link.url += '?';
    }
    return {
      ...link,
      url: link.url ? link.url + plainPrams : null,
    };
  });

  prevNext = prevNext.map((link) => {
    return {
      ...link,
      url: link.url ? link.url + plainPrams : null,
    };
  });
  console.log(links);

  // console.log({ links, prevNext, plainPrams });

  return (
    <div>
      <nav className="pagination-nav flex justify-center my-4">
        <div>
          <a href={prevNext[0].url} className={`p-3 btn  mx-1 btn-neutral`}>
            {'আগের পৃষ্ঠা'}
          </a>
        </div>
        <div>
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className={`p-3 btn  mx-1 ${link.active ? 'btn-outline ' : 'btn-neutral'}`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div>
          <a href={prevNext[1].url} className={`p-3 btn  mx-1 btn-neutral`}>
            {'পরের পৃষ্ঠা'}
          </a>
        </div>
      </nav>
    </div>
  );
}

export default Pagination;
