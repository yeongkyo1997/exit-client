import Link from "next/link";
import Navigation from "../navigation/navigation.container";
import TopMenu from "../topMenu/topMenu.containter";
import * as S from "./header.styles";

export default function HeaderUI() {
  return (
    <>
      <S.Wrapper>
        <S.InnerWrapper>
          <S.Logo>
            <a href="/">
              <img src="/logo.svg" alt="exit" />
            </a>
          </S.Logo>
          <Navigation />
          <TopMenu />
        </S.InnerWrapper>
      </S.Wrapper>
    </>
  );
}
