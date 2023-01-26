import { NavLink, NavLinkProps } from "react-router-dom";

import "./styles.css";

export default function Nav() {
  return (
    <nav className="nav-container">
      <ul className="nav-list">
        <li>
          <Link to="/dnd-kit-kanban">dnd kit Kanban</Link>
        </li>
        <li>
          <Link to="/dnd-react-kanban">React DnD Kanban</Link>
        </li>
      </ul>
    </nav>
  );
}

interface ILinkProps extends Omit<NavLinkProps, "children"> {
  children?: React.ReactNode;
}

function Link(props: ILinkProps) {
  let activeStyle: React.CSSProperties = {
    backgroundColor: "#4d91ff",
    color: "white",
  };

  let inactiveStyle: React.CSSProperties = {
    backgroundColor: "white",
    color: "black",
  };

  return (
    <NavLink style={{ textDecoration: "none" }} {...props}>
      {({ isActive }) => (
        <div
          className="link-children-container"
          style={isActive ? activeStyle : inactiveStyle}
        >
          {props.children}
        </div>
      )}
    </NavLink>
  );
}
