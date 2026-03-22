import {redirect} from "next/navigation";

export default function RootPage() {
    redirect('/moderator/sign-in');
}
