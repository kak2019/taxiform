import { spfi } from '@pnp/sp';
import { getSP } from '../pnpjsConfig';

function useProfile(): { fetchData: () => Promise<any> } {
  const fetchData = async (): Promise<any> => {
    const sp = spfi(getSP());
    return sp.profiles.userProfile
      .then((value) => {
        console.log(value);
        const { DisplayName, AccountName, JobTitle } = value;
        const [, , email] = AccountName.split('|');

        return {
          AccountName:AccountName,
          Requestor: DisplayName,
          Designation: JobTitle,
          Email: email,
        };
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { fetchData };
}


export default useProfile;
