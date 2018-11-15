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
  
  var registers = [0,0,0,0,0,0,0,0,0];
  
  var opcode = 0;
  var instructions = [];
  
  function setMem8(address, data)
  {
    bytes[address] = data & 0xFF;
  }
  function setMem32(address, data)
  {
    bytes[address]   = data & 0xFF;
    bytes[address+1] = (data>>8)  & 0xFF;
    bytes[address+2] = (data>>16) & 0xFF;
    bytes[address+3] = (data>>24) & 0xFF;
  }
  
  function getMem8(address)
  {
    return bytes[address];
  }
  function getMem32(address)
  {
    return bytes[address]|(bytes[address+1]>>8)|(bytes[address+2]>>16)|(bytes[address+3]>>24);
  }
  
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
    return registers[number] && 0xFFFFFFFF;
  }
  function getReg8(number)
  {
    return registers[number] && 0xFF;
  }
  function setReg8(number, data)
  {
    registers[number] = (registers[number] & 0xFFFFFF00) | (data & 0xFF); 
  }
  function setReg16(number, data)
  {
    registers[number] = (registers[number] & 0xFFFF0000) | (data & 0xFFFF); 
  }
  function setReg32(number, data)
  {
    registers[number] = data & 0xFFFFFFFF; 
  }
  function getR8()
  {
    return getReg8(reg);
  }
  function getRM8()
  {
    if (rm == 0b11) return getReg8(reg);
    return getMem8(address);
  }
  function getSR8(data)
  {
    return setReg8(reg,data);
  }
  function setRM8(data)
  {
    if (rm == 0b11) setReg8(reg,data);
    else setMem8(address, data);
  }
  function getR32()
  {
    return getReg32(reg);
  }
  function getRM8()
  {
    if (rm == 0b11) return getReg32(reg);
    return getMem32(address);
  }
  function getSR32(data)
  {
    return setReg32(reg,data);
  }
  function setRM32(data)
  {
    if (rm == 0b11) setReg32(reg,data);
    else setMem32(address, data);
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
  
  instructions[0] = function()
  {
    ModRM(getUInt8());
    setRM8(getR8() + getRM8());
  }
  
  for (var i = 0; i < bytes.length; i++)
  {
    opcode = instructions[getUInt8()];
    if (opcode) opcode();
  }
}
