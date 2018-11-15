function x86(bytes)
{
  var mod = 0;
  var reg = 0;
  var rm  = 0;
  var sib = 0;
  var pc  = 0;
  
  var disp32  = 0;
  var disp8   = 0;
  var address = 0;
  
  function getUInt8()
  {
    return bytes[pc] && 0xFF;
  }
  function getInt8()
  {
    return bytes[pc] && 0xFF;
  }
  function getInt32()
  {
    return bytes[pc] && 0xFFFFFFFF;
  }
  function getReg32(number)
  {
    alert(number);
  }
  function calcAddress()
  {
    switch(mod)
    {
      case 0b00:
        if (rm == 0b100) return null;
        else if (rm == 0b101) return disp32;
        else return getReg32(rm);
        break;
      case 0b01:
        if (rm == 0b100) return null;
        else return getReg32(rm) + disp8;
        break;
      case 0b10:
        if (rm == 0b100) return null;
        else return getReg32(rm) + disp32;
        break;
    }
    return null;
  }
  function ModRM(byte)
  {
    mod = (byte & 0b11000000) >> 6;
    reg = (byte & 0b00111000) >> 3;
    rm  =  byte & 0b00000111;
    sib =  0;

    if (mod !== 0b11 && rm === 0b100)
    {
      sib = getUInt8();
    }
    
    if ((mod === 0b00 && rm === 0b101) || mod === 0b10)
    {
      disp32 = getInt32();
    }
    else if (mod === 0b01)
    {
      disp8 = getInt8();
    }
    
    if (mod !== 0b11 && rm !== 0b100)
    {
      address = calcAddress();
    }

  }
}
