import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { formSlice } from "./store.ts";

import { DatePicker } from "antd";
import dayjs from "dayjs";
import { CURRENT_DATE_FORMAT } from "../helpers/dateFormat";

const { setEndDate } = formSlice.actions;

export function EndDateDatePicker({ style }) {
  const dispatch = useDispatch();
  const endDate = useSelector((state) => state.form.endDate);

  return (
    <DatePicker
      allowClear={false}
      format={CURRENT_DATE_FORMAT}
      inputReadOnly={true}
      defaultValue={endDate ? dayjs(endDate) : dayjs()}
      onChange={(newDate) => {
        dispatch(setEndDate(newDate.format("YYYY-MM-DD")));
      }}
      style={style}
    />
  );
}
