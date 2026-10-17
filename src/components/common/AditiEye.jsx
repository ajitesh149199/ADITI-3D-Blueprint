import "../../styles/aditiEye.css";

function AditiEye({ size = "large", blink = false, className = "" }) {
    const classes = [
        "aditi-eye",
        `aditi-eye-${size}`,
        blink ? "aditi-eye-blinking" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={classes} aria-hidden="true">
            <svg
                className="aditi-eye-svg"
                viewBox="0 0 320 170"
                role="presentation"
            >
                <g className="aditi-eye-lashes">
                    <path d="M86 51 L72 31" />
                    <path d="M116 39 L108 16" />
                    <path d="M147 33 L145 9" />
                    <path d="M178 33 L181 9" />
                    <path d="M208 39 L216 16" />
                    <path d="M236 51 L250 31" />
                </g>

                <g className="aditi-eye-blink-group">
                    <path
                        className="aditi-eye-fill"
                        d="M24 88 C84 25 236 25 296 88 C236 145 84 145 24 88 Z"
                    />

                    <g className="aditi-eye-iris">
                        <circle className="aditi-eye-iris-outer" cx="160" cy="88" r="47" />
                        <circle className="aditi-eye-iris-middle" cx="160" cy="88" r="35" />
                        <circle className="aditi-eye-iris-inner" cx="160" cy="88" r="24" />
                        <ellipse className="aditi-eye-pupil" cx="160" cy="89" rx="14" ry="21" />
                        <circle className="aditi-eye-highlight" cx="153" cy="80" r="5" />
                    </g>

                    <path
                        className="aditi-eye-upper-lid"
                        d="M24 88 C84 25 236 25 296 88"
                    />
                    <path
                        className="aditi-eye-lower-lid"
                        d="M24 88 C84 145 236 145 296 88"
                    />
                </g>
            </svg>
        </div>
    );
}

export default AditiEye;

