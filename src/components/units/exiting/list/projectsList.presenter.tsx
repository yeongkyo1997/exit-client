import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import * as S from "./projectsList.styles";
import { IBoard } from "../../../../commons/types/generated/types";
import { categoriesImgSources } from "../../../../commons/libraries/utils";
import { IExitingListUIProps } from "./projectsList.types";
import SearchWordsModal from "../../../commons/modal/searchWordsModal/searchWordsModal.container";

export default function ExitingListUI(props: IExitingListUIProps) {
  return (
    <>
      {props.isModalVisible && props.modal === "searchWords" && (
        <SearchWordsModal modalData={props.filterData} />
      )}
      <S.Wrapper>
        <S.InnerWrapper>
          {/* 유저 선호카테고리 맞춤 게시물 추천 */}
          {props.userData && props.randomData && (
            <>
              <S.Exiting>exiting</S.Exiting>
              <S.SectionTitle>
                {props.userInfo.nickname &&
                  `${props.userInfo.nickname}님의 선호 카테고리와 일치하는 `}
                오늘의 프로젝트
              </S.SectionTitle>
              <S.RandomProjectWrapper
                onClick={props.onClickProject(props.randomData?.id)}
              >
                <S.Gradient>
                  <img src="/gradient.png" />
                </S.Gradient>
                <S.RandomProjectImageWrapper
                  src={
                    categoriesImgSources[
                      props.randomData?.categories?.[0]?.name
                    ]
                  }
                ></S.RandomProjectImageWrapper>
                <S.RandomProjectTextWrapper>
                  <S.RandomProjectTitle>
                    {props.randomData?.title}
                  </S.RandomProjectTitle>
                  <S.RandomProjectDescription>
                    {props.randomData?.description}
                  </S.RandomProjectDescription>
                  <S.RandomProjectBailWrapper>
                    <S.RandomProjectBailIcon>
                      <img src="/icons/icon_bail.svg" />
                    </S.RandomProjectBailIcon>
                    <S.RandomProjectBail>
                      {props.randomData?.bail.toLocaleString()}
                    </S.RandomProjectBail>
                  </S.RandomProjectBailWrapper>
                </S.RandomProjectTextWrapper>
              </S.RandomProjectWrapper>
            </>
          )}
          <S.ListFilterWrapper>
            <S.FilterButton onClick={props.onClickFilterButton}>
              <img
                src="/icons/icon_filter.png"
                alt="진행중인 프로젝트 리스트 검색 버튼"
              />
            </S.FilterButton>
            {props.searchWords.map((el: any) => (
              <S.FilterItem key={uuidv4()}>{el.word}</S.FilterItem>
            ))}
          </S.ListFilterWrapper>
          <S.CustomInfiniteScroll
            pageStart={0}
            loadMore={props.onFetchMore}
            hasMore={props.filteredBoards.length > 0 ? false : true}
          >
            {/* 검색하지 않았을 때 */}
            {props.filteredBoards.length === 0 &&
              props.searchWords.length === 0 &&
              props.data?.fetchBoards
                .filter(
                  (el: IBoard) =>
                    moment().diff(moment(el?.closedAt), "days") < 0 &&
                    moment().diff(moment(el?.closedAt), "days") >
                      moment().diff(moment(el?.startAt), "days") &&
                    moment().diff(moment(el?.startAt), "days") < 0
                )
                .map((el: IBoard) => (
                  <S.Project
                    key={uuidv4()}
                    onClick={props.onClickProject(el.id)}
                  >
                    <S.ThumbWrapper>
                      {Object.values(props.userInfo).every(
                        (el) => el !== ""
                      ) && (
                        <S.IsLikedWrapper>
                          {props.likedData?.fetchLikes.filter(
                            (likedEl: any) => likedEl.board.id === el.id
                          ).length ? (
                            <img src="/icons/icon_heart_white.png" />
                          ) : (
                            <img src="/icons/icon_heart_off.png" />
                          )}
                        </S.IsLikedWrapper>
                      )}
                      <S.ThumbImageWrapper>
                        {el.boardImage.url.includes(
                          "https://storage.googleapis.com/backend-server"
                        ) || el.boardImage.url.includes("https") ? (
                          <img src={el.boardImage.url} />
                        ) : el.categories?.[0]?.name ? (
                          <img
                            src={categoriesImgSources[el.categories?.[0]?.name]}
                          />
                        ) : (
                          <img src="/noImage.png" />
                        )}
                      </S.ThumbImageWrapper>
                      <S.InfoWrapper>
                        <S.InfoLeftWrapper>
                          <S.CountWrapper>
                            <S.IconWrapper>
                              <img src="/icons/icon_member.png" alt="멤버수" />
                            </S.IconWrapper>
                            <S.Count>
                              {el.countMember}/{el.totalMember}
                            </S.Count>
                          </S.CountWrapper>
                          <S.CountWrapper>
                            <S.IconWrapper>
                              <img
                                src="/icons/icon_heart_off.png"
                                alt="좋아요 수"
                              />
                            </S.IconWrapper>
                            <S.Count>{el.countLike}</S.Count>
                          </S.CountWrapper>
                        </S.InfoLeftWrapper>
                        <S.InfoRightWrapper>
                          <S.Period>
                            {moment(el.startAt).format("YYYY.MM.DD")} ~{" "}
                            {moment(el.endAt).format("YYYY.MM.DD")}
                          </S.Period>
                        </S.InfoRightWrapper>
                      </S.InfoWrapper>
                    </S.ThumbWrapper>
                    <S.ContentsWrapper>
                      <S.ProjectTitle>
                        [{el.address}] {el.title}
                      </S.ProjectTitle>
                      <S.TagsWrapper>
                        {el.tags &&
                          el.tags.map((tag) => (
                            <S.Tag key={uuidv4()}>{tag.name}</S.Tag>
                          ))}
                      </S.TagsWrapper>
                      <S.BailWrapper>
                        <S.BailIconWrapper>
                          <img src="/icons/icon_bail.svg" alt="1인당 보석금" />
                        </S.BailIconWrapper>
                        <S.Bail>{el.bail.toLocaleString()}</S.Bail>
                      </S.BailWrapper>
                    </S.ContentsWrapper>
                  </S.Project>
                ))}
            {/* 검색내역과 검색결과가 있을 때 */}
            {props.filteredBoards.length > 0 &&
              props.searchWords.length > 0 &&
              props.filteredBoards
                // 날짜 필터링
                .filter(
                  (el: IBoard) =>
                    moment().diff(moment(el?.closedAt), "days") < 0 &&
                    moment().diff(moment(el?.closedAt), "days") >
                      moment().diff(moment(el?.startAt), "days") &&
                    moment().diff(moment(el?.startAt), "days") < 0
                )
                .map((el: IBoard) => (
                  <S.Project
                    key={uuidv4()}
                    onClick={props.onClickProject(el.id)}
                  >
                    <S.ThumbWrapper>
                      {Object.values(props.userInfo).every(
                        (el) => el !== ""
                      ) && (
                        <S.IsLikedWrapper>
                          {props.likedData?.fetchLikes.filter(
                            (likedEl: any) => likedEl.board.id === el.id
                          ).length ? (
                            <img src="/icons/icon_heart.png" />
                          ) : (
                            <img src="/icons/icon_heart_off.png" />
                          )}
                        </S.IsLikedWrapper>
                      )}
                      <S.ThumbImageWrapper>
                        {el.boardImage.url.includes(
                          "https://storage.googleapis.com/backend-server"
                        ) || el.boardImage.url.includes("https") ? (
                          <img src={el.boardImage.url} />
                        ) : el.categories?.[0]?.name ? (
                          <img
                            src={categoriesImgSources[el.categories?.[0]?.name]}
                          />
                        ) : (
                          <img src="/noImage.png" />
                        )}
                      </S.ThumbImageWrapper>
                      <S.InfoWrapper>
                        <S.InfoLeftWrapper>
                          <S.CountWrapper>
                            <S.IconWrapper>
                              <img src="/icons/icon_member.png" alt="멤버수" />
                            </S.IconWrapper>
                            <S.Count>
                              {el.countMember}/{el.totalMember}
                            </S.Count>
                          </S.CountWrapper>
                          <S.CountWrapper>
                            <S.IconWrapper>
                              <img
                                src="/icons/icon_heart_off.png"
                                alt="좋아요 수"
                              />
                            </S.IconWrapper>
                            <S.Count>{el.countLike}</S.Count>
                          </S.CountWrapper>
                        </S.InfoLeftWrapper>
                        <S.InfoRightWrapper>
                          <S.Period>
                            {moment(el.startAt).format("YYYY.MM.DD")} ~{" "}
                            {moment(el.endAt).format("YYYY.MM.DD")}
                          </S.Period>
                        </S.InfoRightWrapper>
                      </S.InfoWrapper>
                    </S.ThumbWrapper>
                    <S.ContentsWrapper>
                      <S.ProjectTitle>
                        [{el.address}] {el.title}
                      </S.ProjectTitle>
                      <S.TagsWrapper>
                        {el.tags &&
                          el.tags.map((tag) => (
                            <S.Tag key={uuidv4()}>{tag.name}</S.Tag>
                          ))}
                      </S.TagsWrapper>
                      <S.BailWrapper>
                        <S.BailIconWrapper>
                          <img src="/icons/icon_bail.svg" alt="1인당 보석금" />
                        </S.BailIconWrapper>
                        <S.Bail>{el.bail.toLocaleString()}</S.Bail>
                      </S.BailWrapper>
                    </S.ContentsWrapper>
                  </S.Project>
                ))}
            {/* 검색내역은 있지만 검색결과가 없을 때 */}
            {props.filteredBoards // 날짜 필터링
              .filter(
                (el: IBoard) =>
                  moment().diff(moment(el?.closedAt), "days") < 0 &&
                  moment().diff(moment(el?.closedAt), "days") >
                    moment().diff(moment(el?.startAt), "days") &&
                  moment().diff(moment(el?.startAt), "days") < 0
              ).length === 0 &&
              props.searchWords.length > 0 && <div></div>}
          </S.CustomInfiniteScroll>
        </S.InnerWrapper>
      </S.Wrapper>
    </>
  );
}
