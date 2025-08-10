import { db } from '@/shared/api';

interface props {
  serverId: string;
  profileId?: string;
}
export const getCurrentMember = async ({ serverId, profileId }: props) => {
  return db.member.findFirst({
    where: {
      serverId: serverId,
      profileId: profileId,
    },
    include: {
      profile: true,
    },
  });
};
