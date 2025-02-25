import Activity from "../../ui/activity/activity";
interface IActivity {
  createdAt: string;
  activity: string;
  _id: string;
  userDetails: {
    first_name: string;
    other_names: string;
    last_name: string;
  };
}

export const Activities = ({ activities }: { activities: any }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th className="text-sm font-sans font-medium text-gray-700 text-left">
            Created Date
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 text-left">
            Action
          </th>
          <th className="text-sm font-sans font-medium text-gray-700 text-left">
            Action Taker
          </th>
        </tr>
      </thead>
      <tbody>
        {activities &&
          activities.map((activity: IActivity) => (
            <Activity key={activity._id} activity={activity} />
          ))}
      </tbody>
    </table>
  );
};
