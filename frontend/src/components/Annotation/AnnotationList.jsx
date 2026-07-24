function AnnotationList({ annotations = [] }) {
  return (
    <div>
      <h3>Annotations</h3>

      {annotations.length === 0 ? (
        <p>No annotations</p>
      ) : (
        <ul>
          {annotations.map((item) => (
            <li key={item.id}>
              {item.label} ({item.id})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AnnotationList;