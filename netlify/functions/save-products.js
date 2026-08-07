exports.handler = async (event) => {
  try {
    const products = JSON.parse(event.body);

    const token = process.env.GITHUB_TOKEN;
    const owner = "iangenes759-sketch";
    const repo = "tienda-productos";
    const path = "productos.json";

    // Obtener archivo actual
    const fileRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json"
        }
      }
    );

    const fileData = await fileRes.json();

    // Actualizar productos.json
    const updateRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "Actualización desde panel admin",
          content: Buffer.from(
            JSON.stringify(products, null, 2)
          ).toString("base64"),
          sha: fileData.sha
        })
      }
    );

    const result = await updateRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message
      })
    };
  }
};
