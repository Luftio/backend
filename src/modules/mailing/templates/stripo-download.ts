import axios from "axios";

async function download(id: string) {
  const response = await axios.get(
    "https://viewstripo.email/cabinet/stripeapi/v2/preview/web/" + id,
  );
  console.log(response.data.html);
}

download("ab51d13a-ecd2-4005-95c4-206c038199ee1627550139066");
