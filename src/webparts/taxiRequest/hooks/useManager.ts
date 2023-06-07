import { spfi } from '@pnp/sp';
import { getSP } from '../pnpjsConfig';
import { at } from 'lodash';

function useProfileManager(loginName: string): { fetchData1: () => Promise<any> } {
    const fetchData1 = async (): Promise<any> => {
        const sp = spfi(getSP());
        return sp.profiles.getPropertiesFor(loginName)
            .then((value) => {
                console.log(value);
                const { ExtendedManagers, DisplayName,UserProfileProperties
                } = value;
                //const [, , email] = AccountName.split('|');

                return {
                    lastApprover: ExtendedManagers.at(-1),
                    Displaname: DisplayName,
                    WorkPhoneNumber:UserProfileProperties.at(10).Value



                }
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return { fetchData1 };
}


export default useProfileManager;
