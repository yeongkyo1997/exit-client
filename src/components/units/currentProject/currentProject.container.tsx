import { useApolloClient, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import {
  IAttendance,
  IQuery,
  IQueryFetchBoardArgs,
  IQueryFetchUserBoardsArgs,
  IQueryFetchUserWithUserIdArgs,
  IQueryGetLocationLeaderArgs,
} from "../../../commons/types/generated/types";
import { accessTokenState, userInfoState } from "../../commons/store";
import { FETCH_BOARD } from "../exited/list/ExitedList.queries";
import CurrentProjectUI from "./currentProject.presenter";
import {
  CHECK_GPS,
  FETCH_ATTENDANCE,
  FETCH_USER_BOARDS,
  FETCH_USER_WITH_USER_ID,
  GET_ATTENDANCE_PERCENT,
  GET_LOCATION_LEADER,
} from "./currentProject.queries";
import moment from "moment";
import { Modal } from "antd";

export default function CurrentProject() {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [userInfo, setUserInfo] = useRecoilState(userInfoState);
  const [date, setDate] = useState<any>(moment());
  const [selectedDayAttendence, setSelectedDayAttendance] = useState([]);
  const router = useRouter();
  const client = useApolloClient();

  // 유저 보드
  const { data } = useQuery<
    Pick<IQuery, "fetchUserBoards">,
    IQueryFetchUserBoardsArgs
  >(FETCH_USER_BOARDS, {
    variables: { boardId: String(router.query.projectId) },
  });

  // 보드
  const { data: board } = useQuery<
    Pick<IQuery, "fetchBoard">,
    IQueryFetchBoardArgs
  >(FETCH_BOARD, {
    variables: { boardId: String(router.query.projectId) },
  });

  // 리더
  const { data: leaderData } = useQuery<
    Pick<IQuery, "fetchUserWithUserId">,
    IQueryFetchUserWithUserIdArgs
  >(FETCH_USER_WITH_USER_ID, {
    variables: {
      userId: String(board?.fetchBoard.leader),
    },
  });

  // 출석율
  const { data: getAttendancePercent } = useQuery(GET_ATTENDANCE_PERCENT, {
    variables: { boardId: String(router.query.projectId) },
  });

  const attendancePercent = getAttendancePercent?.getAttendancePercent;

  // 출석 데이터
  const { data: attendanceData } = useQuery(FETCH_ATTENDANCE, {
    variables: {
      boardId: String(router.query.projectId),
    },
  });
  console.log(attendanceData);

  // useEffect(() => {
  //   console.log(getAddressData(attendanceData));
  // });

  // 선택한 날짜 출석데이터 받기
  // useEffect(() => {
  //   const selectedDayAttendanceData = attendanceData?.fetchAttendance?.filter(
  //       moment(el.attendedAt).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
  //   );
  //   setSelectedDayAttendance(selectedDayAttendanceData);
  //   // const addressData = getAddressData(selectedDayAttendanceData);
  //   // console.log(addressData);
  // }, [attendanceData, date]);

  // 리더 위치
  const { data: leaderLocation } = useQuery<
    Pick<IQuery, "getLocationLeader">,
    IQueryGetLocationLeaderArgs
  >(GET_LOCATION_LEADER, {
    variables: {
      boardId: String(router.query.projectId),
    },
  });

  const minDay = moment().add("1", "d").format("YYYY-MM-DD");
  const maxDay = moment().add("3", "m").format("YYYY-MM-DD");

  const onChangeDate = async (newDate: string) => {
    const date: any = moment(newDate).format("YYYY-MM-DD");
    setDate(date);
  };

  const onClickAttend = () => {
    try {
      navigator.geolocation.getCurrentPosition(async function (pos) {
        let latitude = pos.coords.latitude;
        let longitude = pos.coords.longitude;
        // console.log(lat, lng);
        if (!accessToken) {
          Modal.error({ content: "출석 접근 권한이 없습니다." });
          return;
        }
        // if (leaderData?.fetchUserWithUserId.nickname === userInfo.nickname) {
        const result = await client.query({
          query: CHECK_GPS,
          variables: {
            latitude,
            longitude,
            boardId: String(router.query.projectId),
          },
          context: {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        });
        console.log(result);
        // } else {
        //   console.log(
        //     userInfo.nickname,
        //     leaderData?.fetchUserWithUserId.nickname
        //   );
        //   Modal.error({ content: "팀장이 출석체크를 시작할 수 있습니다" });
        // }
      });
    } catch (error) {
      Modal.error({ content: error?.message });
    }
  };

  // console.log(getAddress(37.566826, 126.9786567));

  // const addressData = async () => await getAddress(37.566826, 126.9786567);
  // selectedDayAttendence.map((el) => getAddress(el.latitude, el.longitude)

  // console.log(addressData());

  // console.log(attendanceData);

  // const getAddressData = async (data) => {
  //   data &&
  //     (await Promise.all(
  //       data?.map((el) => getAddress(el.latitude, el.longitude))
  //     ));
  // };

  return (
    <CurrentProjectUI
      // addressData={addressData}
      data={data} // 유저보드 데이터
      date={date} // 날짜 데이터
      leaderData={leaderData}
      selectedDayAttendence={selectedDayAttendence}
      attendanceData={attendanceData}
      board={board}
      userInfo={userInfo}
      leaderLocation={leaderLocation}
      setDate={setDate}
      minDay={minDay}
      maxDay={maxDay}
      onChangeDate={onChangeDate}
      attendancePercent={attendancePercent || 0}
      onClickAttend={onClickAttend}
    />
  );
}
