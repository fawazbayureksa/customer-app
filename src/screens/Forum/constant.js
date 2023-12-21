import { useSelector } from "react-redux";

const state = useSelector(state => state);

const customer_id = JSON.parse(state?.authReducer?.user)?.id

export const filterComent = {
    page: 1,
    per_page: 10,
    mp_customer_id: customer_id,
};