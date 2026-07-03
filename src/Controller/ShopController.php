<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Contracts\Translation\TranslatorInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Enum\ShopType;

final class ShopController extends AbstractController
{
    #[Route('/', name: 'app_shop')]
    public function index(TranslatorInterface $translator): Response
    {
        $shops = [];
        $shop_types = [];   
        foreach (ShopType::cases() as $type) {
            $shop_types[$type->value] = $translator->trans('shop.'.$type->value); 
        }
        return $this->render('shop/index.html.twig', [
            'controller_name' => 'ShopController',
            'shops' => $shops,
            'types' => $shop_types
        ]);
    }

    #[Route('/add', name: 'app_shop_add', methods: ['POST'])]
    public function add(Request $request): JsonResponse
    {
        $shops = [];
        $shop_types = [];   
        foreach (ShopType::cases() as $type) {
            $shop_types[$type->value] = $translator->trans('shop.'.$type->value); 
        }
        return new JsonResponse(['msg' => 'Magasin ajouté']);
    }
}
