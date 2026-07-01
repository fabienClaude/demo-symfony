<?php

namespace App\Entity\Enum;

enum ShopType: string
{
    case OTHER = 'other';
    case BOOKSTORE = 'book_store';
    case ELECTRONICSTORE = 'electronic_store';
    case BAKERY = 'bakery';
    case SOUVENIRSTORE = 'souvenir_store';
    case FASTFOOD = 'fast_food';
    case RESTAURANT = 'restaurant';
    case SUPERMARKET = 'supermarket';
    case PHARMACY = 'pharmacy';
}
