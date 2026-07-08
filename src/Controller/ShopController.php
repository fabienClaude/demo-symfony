<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Contracts\Translation\TranslatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Shop;
use App\Entity\Enum\ShopType;
use App\Repository\ShopRepository;
use App\Form\Type\ShopFormType;

final class ShopController extends AbstractController
{
    //Page principale de l'application
    #[Route('/', name: 'app_shop')]
    public function index(TranslatorInterface $translator,ShopRepository $shoprepository): Response
    {
        $shops = $shoprepository->findAll();
        $shops = array_map(function ($s) { 
            return  $s->toArray(); 
        }, $shoprepository->findAll());
        $shop_types = [];   
        foreach (ShopType::cases() as $type) {
            $shop_types[] = [
                'id' => $type->value,
                'value' => $translator->trans('shop.'.$type->value)
            ]; 
        }
        return $this->render('shop/index.html.twig', [
            'controller_name' => 'ShopController',
            'shops' => $shops,
            'types' => $shop_types
        ]);
    }

    //Ajout de magasin
    #[Route('/add', name: 'app_shop_add', methods: ['POST'])]
    public function add(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $shop = new Shop();
        $form = $this->createForm(ShopFormType::class, $shop);
        $data = json_decode($request->getContent(), true);

        $form->submit($data);
        if ($form->isSubmitted() && $form->isValid()) {
            //Les données du formulaire sont associés au magasin
            $em->persist($shop);
            $em->flush();

            
            return new JsonResponse([
                'message' => 'Magasin ajouté',
                'shop' => $shop->toArray()
            ]);
        }else{
            $errors = [];
            foreach ($form->getErrors(true) as $error) {
                $errors[] = $error->getMessage();
            }
            return new JsonResponse(
                ['message' => $errors[0] ?? 'Données invalides.', 'errors' => $errors],
                422
            );
        }
    }
}
