const extractJSON = async (raw) => {
  if (!raw) {
    return null;
  }

  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const closeBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || closeBrace === -1) return null;

  const jsonString = cleaned.slice(firstBrace, closeBrace + 1);

  try {
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return null;
  }
};

export default extractJSON;
