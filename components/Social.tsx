
import { SiInstagram, SiFacebook, SiGmail } from 'react-icons/si';

export default function Social() {
  return (
    <div className="flex  space-x-4">
        <SiInstagram href="https://www.instagram.com/deckdoctorsne/" target="blank"/>
        <SiFacebook href="https://www.facebook.com/profile.php?id=61562144881770" target="blank"/>
        <SiGmail href="mailto:contact@deckdocne.com" target="blank"/>
    </div>
  );
}