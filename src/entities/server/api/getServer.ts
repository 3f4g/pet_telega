import { db } from '@/shared/api';
import { ChannelType, type Channel, type Member, type Profile, type Server } from '@prisma/client';

interface ServerWithRelations extends Server {
  channels: Channel[];
  members: (Member & { profile: Profile })[];
}

interface GetServerResult {
  server: ServerWithRelations;
  textChannels: Channel[];
  audioChannels: Channel[];
  videoChannels: Channel[];
  members: (Member & { profile: Profile })[];
}

interface Props {
  serverId: string;
  profileId: string;
}

export const getServer = async ({
  serverId,
  profileId,
}: Props): Promise<GetServerResult | null> => {
  try {
    const server = await db.server.findUnique({
      where: { id: serverId },
      include: {
        channels: { orderBy: { createdAt: 'asc' } },
        members: {
          include: { profile: true },
          orderBy: { role: 'asc' },
        },
      },
    });

    if (!server) return null;

    const typedServer = server as ServerWithRelations;

    const filterChannels = (type: ChannelType) =>
      typedServer.channels.filter((channel) => channel.type === type);

    const textChannels = filterChannels(ChannelType.TEXT);
    const audioChannels = filterChannels(ChannelType.AUDIO);
    const videoChannels = filterChannels(ChannelType.VIDEO);

    const members = typedServer.members.filter((member) => member.profileId !== profileId);

    return {
      server: typedServer,
      textChannels,
      audioChannels,
      videoChannels,
      members,
    };
  } catch (error) {
    console.error('Failed to fetch server:', error);
    return null;
  }
};
