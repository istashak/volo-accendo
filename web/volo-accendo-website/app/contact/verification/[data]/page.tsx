export default async function Page({
  params,
}: {
  params: Promise<{ data: string }>;
}) {
  const data = decodeURIComponent((await params).data);
  const decodedData = Buffer.from(data, "base64").toString("utf-8");
  const parts = decodedData.split("|");
  const email = parts[0];
  const firstName = parts[1];

  console.log("data = " + data);
  console.log("email = " + email);
  console.log("firstName = " + firstName);

  return (
    <div>
      <p className="mb-4 font-semibold">{`Thank ${firstName}, you've successfully verified your email address. ${email}`}</p>
    </div>
  );
}

// Here for experimenting with next.config.mjs output: "export" option
// export async function generateStaticParams() {
//   return [{data:"foo"}];
// }
