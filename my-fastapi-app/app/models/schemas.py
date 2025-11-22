from pydantic import BaseModel
from typing import List, Optional

class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int

class ItemList(BaseModel):
    items: List[Item]