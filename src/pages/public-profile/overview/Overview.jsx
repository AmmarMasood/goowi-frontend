import React from "react";

const heading = "text-xl font-bold m-0 p-0";
const container = "flex flex-col mb-3 p-0";
const text = "text-gray-900 text-md m-0 p-0";

function Overview({
  overview,
  industry,
  website,
  address,
  phone,
  socialMediaLinks,
  certifications,
}) {
  return (
    <div className="mt-4">
      <div className={container}>
        <h1 className={heading}>Overview</h1>
        <p className={`${text} text-gray-950`}>{overview}</p>
      </div>
      {industry && (
        <div className={container}>
          <h1 className={heading}>Industry</h1>
          <p className={text}>{industry}</p>
        </div>
      )}
      {website && (
        <div className={container}>
          <h1 className={heading}>Company Website</h1>
          <a
            href={website}
            className={text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {website}
          </a>
        </div>
      )}
      {address && (
        <div className={container}>
          <h1 className={heading}>Address</h1>
          <p className={text}>{address}</p>
        </div>
      )}
      <div className={container}>
        <h1 className={heading}>Phone</h1>
        <p className={text}>{phone}</p>
      </div>
      <div className={container}>
        <h1 className={heading}>Social Media Links</h1>
        {socialMediaLinks?.map((link, i) => (
          <a
            href={link.url}
            className={text}
            target="_blank"
            rel="noopener noreferrer"
            key={i}
          >
            {link}
          </a>
        ))}
      </div>
      {certifications && (
        <div className={container}>
          <h1 className={heading}>Certifications</h1>
          {certifications?.map((link, i) => (
            <a
              href={link.url}
              className={text}
              target="_blank"
              rel="noopener noreferrer"
              key={i}
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default Overview;
