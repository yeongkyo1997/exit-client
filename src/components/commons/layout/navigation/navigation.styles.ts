import styled from "@emotion/styled";

export const GNB = styled.ul`
  display: flex;
`;

export const NavigationItem = styled.li`
  margin-right: 70px;
  &:last-of-type {
    margin-right: 0;
  }
`;

export const NavigationLink = styled.a`
  font-size: 2.2rem;
  font-weight: 700;
  transition: 0.1s;
  &:hover {
    color: #3ebd5d !important;
  }
`;
