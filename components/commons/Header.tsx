import { useRouter } from "next/router";
import styled from "styled-components";
import { m } from "framer-motion";

// Svg
import HomeSvg from "../../public/icons/fontawesome/light/home.svg";

import { whileTapAnimationIconButton } from "../../constants/config";
import { useHistory } from "../../context/history.context";
import Link from "next/link";
import BackButton from "./BackButton";

interface IHeaderProps {
  children?: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  noBackground?: boolean;
  shadow?: boolean;
  fixed?: boolean;
}
export default function Header(props: IHeaderProps) {

  return (
    <Style {...props}>
      <div className="flex" style={{ width: "42px" }}>
        {props.showBackButton && (
          <>
            <BackButton />
            <div>{props.children}</div>
          </>
        )}
      </div>
      <div className="title flex align-items-center justify-content-center">
        {props.title}
      </div>
      <div className="flex" style={{ width: "42px" }}></div>
    </Style>
  );
}

// Style
const Style = styled.header<IHeaderProps>`
  height: 60px;
  position: ${({ fixed }) => (fixed ? "fixed" : "relative")};
  top: 0;
  z-index: 100;
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: var(--global-padding);
  padding-right: var(--global-padding);
  border-bottom: ${({ shadow }) =>
    shadow ? "1px solid var(--border-color-light)" : "none"};
  background-color: ${({ noBackground }) =>
    noBackground ? "transparent" : " #ffffff"};

  .title {
    font-size: 24px;
    line-height: 24px;
    font-weight: bold;
    color: var(--text-color-1);
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    cursor: pointer;
    background-color: #ffffff;
    /* border: 1px solid black; */
  }
`;
