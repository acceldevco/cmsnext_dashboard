import React from "react";

interface FigmaInspiredComponentProps {
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaUrl?: string;
}

const FigmaInspiredComponent: React.FC<FigmaInspiredComponentProps> = ({
  title,
  description,
  image,
  ctaText,
  ctaUrl,
}) => {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "2rem",
        background: "#fff",
        borderRadius: "24px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "2rem 3rem",
        margin: "2rem 0",
      }}
    >
      <div style={{ flex: 1 }}>
        <h2 style={{ fontSize: "2.2rem", fontWeight: 700, marginBottom: "1rem" }}>{title}</h2>
        <p style={{ fontSize: "1.15rem", color: "#555", marginBottom: "1.5rem" }}>{description}</p>
        {ctaText && ctaUrl && (
          <a
            href={ctaUrl}
            style={{
              display: "inline-block",
              background: "#0070f3",
              color: "#fff",
              padding: "0.75rem 2rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "1rem",
              transition: "background 0.2s",
            }}
          >
            {ctaText}
          </a>
        )}
      </div>
      <div style={{ flex: 1, textAlign: "center" }}>
        <img
          src={image}
          alt={title}
          style={{
            maxWidth: "100%",
            borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            objectFit: "cover",
          }}
        />
      </div>
    </section>
  );
};

export { FigmaInspiredComponent };