
import { SiInstagram, SiFacebook, SiGmail } from 'react-icons/si';

export default function Social() {
  return (
    <div className="flex  space-x-4">
        <a href="https://www.instagram.com/deckdoctorsne/" target="blank"><SiInstagram  /></a>
        <a href="https://www.facebook.com/profile.php?id=61562144881770" target="blank"><SiFacebook/></a>
        <a href="mailto:contact@deckdocne.com" target="blank"><SiGmail/></a>
    </div>
  );
}