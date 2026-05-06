import { MouseEvent } from "react";
import { Link, LinkProps, useNavigate } from "react-router-dom";

const isModifiedEvent = (event: MouseEvent<HTMLAnchorElement>) =>
  event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0;

const SafeLink = ({ to, onClickCapture, ...props }: LinkProps) => {
  const navigate = useNavigate();

  const handleClickCapture = (event: MouseEvent<HTMLAnchorElement>) => {
    onClickCapture?.(event);

    if (event.defaultPrevented || isModifiedEvent(event)) return;

    event.preventDefault();
    event.stopPropagation();
    navigate(to);
  };

  return <Link to={to} onClickCapture={handleClickCapture} {...props} />;
};

export default SafeLink;