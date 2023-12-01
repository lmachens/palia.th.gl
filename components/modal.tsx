export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <>
      <article
        className={`fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-[5000] mx-auto max-w-xl bg-neutral-800 text-white shadow-lg flex flex-col p-4 pt-8 rounded-lg select-none`}
      >
        {children}
        <button onClick={onClose} className="absolute top-2 right-2">
          <svg className="w-[16px] h-[16px]">
            <use xlinkHref="#icon-close" />
          </svg>
        </button>
      </article>
      <div
        className="fixed inset-0 bg-black opacity-50 z-[4999]"
        onClick={onClose}
      />
    </>
  );
}
