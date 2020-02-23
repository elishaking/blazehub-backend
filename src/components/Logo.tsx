import React from "react";

interface LogoProps {
  color?: string;
  style?: React.CSSProperties;
}

export default function Logo({ color = "#7c62a9", style }: LogoProps) {
  //   if (!color) color = "#7c62a9";

  return (
    <svg
      id="logo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 34.202 25.018"
      //   role="img"
      height="1em"
      width="1.36em"
      className="svg-inline--fa fa-w-16"
      style={style}
    >
      <path
        id="Path_1"
        data-name="Path 1"
        d="M86.8,240.021a.307.307,0,0,1,.311-.288h8.33a1.965,1.965,0,0,0,1.371-.549,1.837,1.837,0,0,0,.568-1.332,1.928,1.928,0,0,0-1.968-1.868H86.36a.725.725,0,0,1-.633-.36,9.319,9.319,0,0,0-.941-1.36.3.3,0,0,1,.244-.49h7.785a1.966,1.966,0,0,0,1.371-.549,1.837,1.837,0,0,0,.568-1.332,1.927,1.927,0,0,0-1.968-1.868H75.347q-.175,0-.352,0c-6.526,0-11.815,4.317-11.815,9.642S68.47,249.3,75,249.3a13.172,13.172,0,0,0,8.535-2.975,1.529,1.529,0,0,1,.991-.365h9.872a1.966,1.966,0,0,0,1.371-.549,1.838,1.838,0,0,0,.568-1.332,1.927,1.927,0,0,0-1.967-1.868H86.811a.3.3,0,0,1-.3-.383A7.97,7.97,0,0,0,86.8,240.021ZM75,245.55c-3.984,0-7.214-2.636-7.214-5.887s3.23-5.887,7.214-5.887,7.214,2.636,7.214,5.887S78.98,245.55,75,245.55Z"
        transform="translate(-63.18 -230.02)"
        fill={color}
      />
      <ellipse
        id="Ellipse_1"
        data-name="Ellipse 1"
        cx="2.889"
        cy="2.867"
        rx="2.889"
        ry="2.867"
        transform="translate(21.163 19.285)"
        fill={color}
      />
    </svg>
  );
}
