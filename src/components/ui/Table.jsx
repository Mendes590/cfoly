import { useState } from "react";
import { useC } from "../../core/context.jsx";

export function Th({ children }) {
  const { th } = useC();
  return (
    <th style={{
      textAlign: "left", fontSize: 10, fontWeight: 700, color: th.textM,
      padding: "9px 14px", borderBottom: `1px solid ${th.border}`,
      letterSpacing: "0.08em", textTransform: "uppercase",
      background: th.bgSection, whiteSpace: "nowrap",
    }}>
      {children}
    </th>
  );
}

export function Td({ children, s = {} }) {
  const { th } = useC();
  return (
    <td style={{ padding: "11px 14px", fontSize: 13, color: th.textS, ...s }}>{children}</td>
  );
}

export function TRow({ children }) {
  const { th } = useC();
  const [h, setH] = useState(false);
  return (
    <tr
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? th.bgCardH : "transparent",
        transition: "background 0.12s",
        borderBottom: `1px solid ${th.border}`,
      }}
    >
      {children}
    </tr>
  );
}
