
function ModRM(byte)
{
  var mod = (byte & 0b11000000) >> 6;
  var reg = (byte & 0b00111000) >> 3;
  var rm  =  byte & 0b00000111;
  var sib =  0;
  
  if (mod !== 0b11 && rm === 0b100)
  {
    sib = getByte();
  }
  
}
