export default function Page({ params }: { params?: any }) {
  return (
    <div style={{ padding: 24 }}>
      <h1>Dynamic Category Route OK</h1>
      <pre>{JSON.stringify(params, null, 2)}</pre>
    </div>
  );
}
