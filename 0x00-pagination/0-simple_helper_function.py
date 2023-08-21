#!/usr/bin/env python3
"""
A function named index_range that takes two integer arguments

"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    A start index and an end index corresponding to the range of indexes
    """
    return ((page-1) * page_size, page_size * page)
