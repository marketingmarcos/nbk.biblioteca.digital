import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/states";

type PdfDoc = {
  numPages: number;
  getPage: (n: number) => Promise<{
    getViewport: (o: { scale: number }) => { width: number; height: number };
    render: (o: { canvas: HTMLCanvasElement; viewport: unknown }) => { promise: Promise<void> };
  }>;
  destroy?: () => Promise<void>;
};

export function PdfView({
  data,
  initialPage,
  onPage,
}: {
  data: ArrayBuffer;
  initialPage: number;
  onPage: (page: number, total: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onPageRef = useRef(onPage);
  onPageRef.current = onPage;
  const [page, setPage] = useState(Math.max(1, initialPage));
  const [total, setTotal] = useState(0);
  const [failed, setFailed] = useState("");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const docRef = useRef<PdfDoc | null>(null);

  useEffect(() => {
    let cancel = false;
    const taskRef: { destroy?: () => void } = {};
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
        const task = pdfjs.getDocument({ data: data.slice(0) });
        taskRef.destroy = () => task.destroy();
        const doc = await task.promise;
        if (cancel) {
          await (doc as PdfDoc).destroy?.();
          return;
        }
        docRef.current = doc as PdfDoc;
        setTotal(doc.numPages);
        setPage((current) => Math.min(Math.max(1, current), doc.numPages));
      } catch (error) {
        if (cancel) return;
        setFailed(error instanceof Error ? error.message : "Não foi possível abrir o PDF com o leitor.");
        const url = URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
        setBlobUrl(url);
      }
    })();
    return () => {
      cancel = true;
      taskRef.destroy?.();
      void docRef.current?.destroy?.();
      docRef.current = null;
    };
  }, [data]);

  useEffect(() => {
    const doc = docRef.current;
    const canvas = canvasRef.current;
    if (!doc || !canvas || failed) return;
    let cancel = false;
    (async () => {
      const pdfPage = await doc.getPage(page);
      if (cancel) return;
      const base = pdfPage.getViewport({ scale: 1 });
      const width = Math.min(canvas.parentElement?.clientWidth || 720, 760);
      const viewport = pdfPage.getViewport({ scale: width / base.width });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await pdfPage.render({ canvas, viewport }).promise;
    })();
    return () => {
      cancel = true;
    };
  }, [page, total, failed]);

  useEffect(() => () => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
  }, [blobUrl]);

  if (failed && blobUrl) {
    return (
      <div className="space-y-3">
        <ErrorState message={`${failed} Abrimos o visualizador nativo do navegador.`} />
        <iframe title="Leitor de PDF" src={blobUrl} className="h-[70vh] w-full rounded-lg bg-paper" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-auto rounded-lg bg-paper p-3">
        <canvas ref={canvasRef} className="mx-auto h-auto max-w-full" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="secondary" disabled={page <= 1} onClick={() => setPage((value) => { const next = value - 1; onPageRef.current(next, total); return next; })}>
          Página anterior
        </Button>
        <p className="text-sm tabular-nums text-muted">{total ? `${page} / ${total}` : "Abrindo PDF…"}</p>
        <Button type="button" variant="secondary" disabled={!total || page >= total} onClick={() => setPage((value) => { const next = value + 1; onPageRef.current(next, total); return next; })}>
          Próxima página
        </Button>
      </div>
    </div>
  );
}
