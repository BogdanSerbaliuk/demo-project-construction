import { Link } from "react-router-dom";

const base =
    "inline-flex items-center justify-center rounded-md px-6 py-3 font-semibold " +
    "transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus-visible:outline-blue-300",
    ghost: "border border-white/60 text-white hover:bg-white/10",
};

function Button({ to, href, variant = "primary", className = "", ...props }) {
    const classes = `${base} ${variants[variant]} ${className}`;

    if (to) return <Link to={to} className={classes} {...props} />;
    if (href) return <a href={href} className={classes} {...props} />;
    return <button type="button" className={classes} {...props} />;
}

export default Button;