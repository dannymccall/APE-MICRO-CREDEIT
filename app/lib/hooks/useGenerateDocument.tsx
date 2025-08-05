export const useGenerateDocument = async (
  reportGenerationRef: React.RefObject<HTMLDivElement>,
  type: "pdf" | "excel",
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!reportGenerationRef.current) return;

  setLoading(true);

  // Get the HTML content of the report
  const html = reportGenerationRef.current.outerHTML;

  try {
    const res = await fetch(`/api/generate-document/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });

    if (!res.ok) throw new Error(`Failed to generate ${type.toUpperCase()}`);

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    // Download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = `report.${type === "pdf" ? "pdf" : "xlsx"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error(`Error generating ${type.toUpperCase()}:`, error);
  } finally {
    setLoading(false);
  }
};