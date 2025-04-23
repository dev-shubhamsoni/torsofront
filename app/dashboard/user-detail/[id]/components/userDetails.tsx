import { Button } from "@/components/ui/button";
import React from "react";
import { MoneyAddPopup } from "./moneyAddPopup";
import { MoneyRemovePopup } from "./moneyRemovePopup";

interface Dataprops {
  full_name: string;
  mobile_number: number;
  wallet_balance: number;
  pin: number;
  active: boolean;
  transfer: boolean;
  betting: boolean;
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  phone_pay_no: number;
  google_pay_no: number;
  paytm_pay_no: number;
}

interface UserDataProps {
  userData: Dataprops;
  triggerAddMoney: ({
    amount,
    uid,
  }: {
    amount: number;
    uid: string | undefined;
  }) => void;
  triggerRemoveMoney: ({
    amount,
    uid,
  }: {
    amount: number;
    uid: string | undefined;
  }) => void;
  uid?: string;
}

const UserDetails: React.FC<UserDataProps> = ({
  userData,
  triggerAddMoney,
  triggerRemoveMoney,
  uid,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6  ">
      {/* Left Section - User Card */}
      <div className="bg-indigo-100 p-6 rounded-lg shadow-md w-full h-fit lg:w-1/3">
        <h2 className="text-xl font-semibold text-indigo-800">
          {userData?.full_name}
        </h2>
        <p className="text-gray-600">{userData?.mobile_number}</p>

        <div className="mt-2 flex items-center gap-4">
          <span
            className={`${
              userData?.active ? "bg-green-500" : "bg-red-500"
            }  text-white px-3 py-1 rounded-full text-sm`}
          >
            Active: {userData?.active ? "Yes" : "No"}
          </span>
          <span
            className={`${
              userData?.betting ? "bg-green-500" : "bg-red-500"
            } text-white px-3 py-1 rounded-full text-sm`}
          >
            Betting: {userData?.betting ? "Yes" : "No"}
          </span>
          <span
            className={`${
              userData?.transfer ? "bg-green-500" : "bg-red-500"
            } text-white px-3 py-1 rounded-full text-sm`}
          >
            Transfer: {userData?.transfer ? "Yes" : "No"}
          </span>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-gray-700 font-medium">Available Balance</h3>
          <p className="text-2xl font-bold">{userData?.wallet_balance}</p>

          <div className="mt-4 flex gap-4">
            <MoneyAddPopup triggerAddMoney={triggerAddMoney} uid={uid} />
            <MoneyRemovePopup
              triggerRemoveMoney={triggerRemoveMoney}
              uid={uid}
            />
          </div>
        </div>
      </div>

      {/* Right Section - Personal Information */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full lg:w-2/3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <Button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Edit Details
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-700 font-medium">Full Name:</p>
            <p className="text-gray-900">{userData?.full_name}</p>
          </div>
          <div>
            <p className="text-gray-700 font-medium">Security Pin:</p>
            <p className="text-gray-900">{userData?.pin}</p>
          </div>

          <div>
            <p className="text-gray-700 font-medium">Mobile:</p>
            <p className="text-gray-900">{userData?.mobile_number}</p>
          </div>
        </div>

        {/* Payment Information */}
        <h2 className="mt-6 text-xl font-semibold">Payment Information</h2>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-700 font-medium">Bank Name:</p>
            <p className="text-gray-900">
              {userData?.bank_name ? userData?.bank_name : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-700 font-medium">A/c Holder Name:</p>
            <p className="text-gray-900">
              {userData?.account_holder_name
                ? userData?.account_holder_name
                : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-700 font-medium">A/c Number:</p>
            <p className="text-gray-900">
              {userData?.account_number ? userData?.account_number : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-700 font-medium">IFSC Code:</p>
            <p className="text-gray-900">
              {userData?.ifsc_code ? userData?.ifsc_code : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-700 font-medium">PhonePe No.:</p>
            <p className="text-gray-900">
              {userData?.phone_pay_no ? userData?.phone_pay_no : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-700 font-medium">Google Pay No.:</p>
            <p className="text-gray-900">
              {userData?.google_pay_no ? userData?.google_pay_no : "N/A"}
            </p>
          </div>
          <div>
            <p className="text-gray-700 font-medium">Paytm No.:</p>
            <p className="text-gray-900">
              {userData?.paytm_pay_no ? userData?.paytm_pay_no : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
