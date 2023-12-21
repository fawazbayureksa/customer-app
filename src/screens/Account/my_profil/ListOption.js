import { AuctionRouteName } from "../../../constants/auction_route/auctionRouteName"
import { ForumRouteName } from "../../../constants/forum_route/forumRouteName"
import { MainRouteName } from "../../../constants/mainRouteName"
import { MarketplaceRouteName } from "../../../constants/marketplace_route/marketplaceRouteName"
import { WebinarRouteName } from "../../../constants/webinar_route/webinarRouteName"
import { drsRouteName } from "../../../constants/drs_route/drsRouteName"

export const ListOptions = [
    {
        Path: MainRouteName.PROFILE_SETTING,
        Title: "Profil Saya",
        Subtitle: "Atur Informasi profil Anda",
        IconName: "Test",
    },
    {
        Path: MainRouteName.ADDRESS_SETTING,
        Title: "Pengaturan Alamat",
        Subtitle: "Atur alamat pengiriman anda",
        IconName: "Test",
    },
    {
        Path: MarketplaceRouteName.ORDER_LIST,
        Title: "Pesanan Saya",
        Subtitle: "Cek status belanja produk Anda",
        IconName: "Test",
    },
    {
        Path: ForumRouteName.MY_FORUM,
        Title: "Forum Saya",
        Subtitle: "Lihat postingan forum anda",
        IconName: "Test",
    },
    {
        Path: WebinarRouteName.WEBINAR_TICKET_LIST,
        Title: "E-Tiket HaloChef",
        Subtitle: "Lihat jadwal kelas kamu bersama para Chef",
        IconName: "Test",
    },
    {
        Path: AuctionRouteName.HISTORY_AUCTION,
        Title: "Lelang 365",
        Subtitle: "Lihat penawaran lelang yang anda ikuti",
        IconName: "Test",
    },
]
export const ListOptionsSeller = [
    {
        Path: ForumRouteName.MY_FORUM,
        Title: "Live Streaming",
        Subtitle: "Lihat riwayat live streaming Anda",
        IconName: "Test",
    },
    {
        Path: ForumRouteName.MY_FORUM,
        Title: "Forum Saya",
        Subtitle: "Lihat postingan forum anda",
        IconName: "Test",
    },
    {
        Path: WebinarRouteName.WEBINAR_DASHBOARD,
        Title: "E-Tiket HaloChef",
        Subtitle: "Lihat jadwal kelas kamu bersama para Chef",
        IconName: "Test",
    },

]

export const Setting = [
    {
        Title: "Bahasa",
        Path: MainRouteName.SELECT_LANGUAGE,
    },
    {
        Title: "Syarat & Ketentuan",
        Path: 'MyForum',
    },
    {
        Title: "Kebijakan Privasi",
        Path: 'MyForum',
    },
    {
        Title: "Pusat Bantuan",
        // Path: HelpRouteName.HELP,
        Path: drsRouteName.HELP_CENTER_FAQ,
    }
]